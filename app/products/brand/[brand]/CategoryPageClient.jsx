"use client";

import { useState, useEffect } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import { useSession } from "next-auth/react";

export default function CategoryPageClient({ products, brand }) {
  const [wishlist, setWishlist] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (session) {
        try {
          const res = await fetch("/api/wishlistAll"); // Changed to wishlistAll
          const data = await res.json();
          if (Array.isArray(data.items)) {
            setWishlist(data.items.map((item) => item._id));
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchWishlist();
  }, [session]);

  const handleWishlistUpdate = (productId, isAdding) => {
    if (isAdding) {
      setWishlist([...wishlist, productId]);
    } else {
      setWishlist(wishlist.filter((id) => id !== productId));
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-700 mb-4 uppercase">
        {brand} Watches
      </h1>
      <p className="mb-6 text-slate-700">
        Total Watches Available: {products.length}
      </p>
      <ProductGrid
        products={products}
        wishlist={wishlist}
        onWishlistUpdate={handleWishlistUpdate}
      />
    </>
  );
}

