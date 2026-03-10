import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Video } from "@/lib/models/Video";
import { PAGE_SIZE } from "@/lib/constants";
import { FilterStatus, RiskCategory, SortOption } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = parseInt(searchParams.get("limit") || String(PAGE_SIZE));
    const status = (searchParams.get("status") || "unlabeled") as FilterStatus;
    const risk_category = searchParams.get("risk_category") || "all";
    const search = searchParams.get("search") || "";
    const sort = (searchParams.get("sort") || "risk_desc") as SortOption;

    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (status === "unlabeled") {
      filter.$or = [
        { ground_truth_label: null },
        { ground_truth_label: { $exists: false } },
      ];
    } else if (status === "labeled") {
      filter.ground_truth_label = { $nin: [null], $exists: true };
    }

    if (risk_category !== "all") {
      filter.risk_category = risk_category as RiskCategory;
    }

    if (search) {
      filter.$or = [
        ...(filter.$or || []),
        { video_title: { $regex: search, $options: "i" } },
        { channel_title: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortObj: Record<string, any> = {};
    switch (sort) {
      case "risk_desc":
        sortObj.total_risk_score = -1;
        sortObj.confidence_score = -1;
        break;
      case "confidence_desc":
        sortObj.confidence_score = -1;
        break;
      case "confidence_asc":
        sortObj.confidence_score = 1;
        break;
      case "detected_desc":
        sortObj.detected_at = -1;
        break;
      default:
        sortObj.total_risk_score = -1;
    }

    const skip = (page - 1) * limit;

    // Run query + stats aggregation in parallel
    const [videos, total, statsResult] = await Promise.all([
      Video.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
      Video.countDocuments(filter),
      Video.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            labeled: [
              {
                $match: {
                  ground_truth_label: { $nin: [null], $exists: true },
                },
              },
              { $count: "count" },
            ],
            true_positive: [
              { $match: { ground_truth_label: "true_positive" } },
              { $count: "count" },
            ],
            false_positive: [
              { $match: { ground_truth_label: "false_positive" } },
              { $count: "count" },
            ],
            true_negative: [
              { $match: { ground_truth_label: "true_negative" } },
              { $count: "count" },
            ],
            false_negative: [
              { $match: { ground_truth_label: "false_negative" } },
              { $count: "count" },
            ],
          },
        },
      ]),
    ]);

    const aggResult = statsResult[0];
    const totalCount = aggResult.total[0]?.count ?? 0;
    const labeledCount = aggResult.labeled[0]?.count ?? 0;

    const stats = {
      total: totalCount,
      labeled: labeledCount,
      unlabeled: totalCount - labeledCount,
      true_positive: aggResult.true_positive[0]?.count ?? 0,
      false_positive: aggResult.false_positive[0]?.count ?? 0,
      true_negative: aggResult.true_negative[0]?.count ?? 0,
      false_negative: aggResult.false_negative[0]?.count ?? 0,
    };

    // Serialize _id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialized = videos.map((v: any) => ({
      ...v,
      _id: v._id.toString(),
    }));

    return NextResponse.json({
      videos: serialized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats,
    });
  } catch (error) {
    console.error("GET /api/videos error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
