import connect from "@/utils/config/dbConnection";
import { Product } from "@/utils/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connect();

  const { brand } = params;

  try {
    // Ensure brand is not empty or undefined
    if (!brand || brand.trim() === "") {
      return NextResponse.json(
        { error: "Brand parameter is required" },
        { status: 400 }
      );
    }

    // Use a more straightforward regex for brand matching
    const brandRegex = new RegExp(`^${brand}$`, "i"); // Exact match, case-insensitive

    const foundProducts = await Product.find({ brand: brandRegex })
      .populate("user")
      .sort({ createdAt: -1 });

    if (foundProducts.length > 0) {
      return NextResponse.json(foundProducts);
    } else {
      return NextResponse.json(
        { error: "No products found for this brand" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching brand products:", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Error fetching brand products" },
      { status: 500 }
    );
  }
}
