import axios from "axios";
 import LoadingErrorComponent from "@/components/Loader/LoadingErrorComponent";
 import { Suspense } from "react";
 import CategoryPageClient from "./CategoryPageClient";

 export default async function CategoryPage({ params }) {
   const { brand } = params;
   let products = [];
   let error = null;

   // Check if brand is undefined
   if (!brand) {
     console.error("Brand is undefined in CategoryPage");
     error = "Invalid brand";
     return (
       <div className="flex flex-col min-h-screen">
         <main className="flex-grow container mx-auto px-4 py-8">
           <LoadingErrorComponent loading={false} error={error} />
         </main>
       </div>
     );
   }

   try {
     const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/brand/${brand}`);
     products = res.data;
   } catch (err) {
     console.error(err);
     error = "Error loading products";
   }

   return (
     <div className="flex flex-col min-h-screen">
       <main className="flex-grow container mx-auto px-4 py-8">
         {error ? (
           <LoadingErrorComponent loading={false} error={error} />
         ) : (
           <Suspense fallback={<LoadingErrorComponent loading={true} error={null} />}>
             <CategoryPageClient products={products} brand={brand} />
           </Suspense>
         )}
       </main>
     </div>
   );
 }

