import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { fetchProducts } from '../services/ProductServices.ts'
import React, { useState } from 'react';

const ProductTable = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

    interface Product {
        id: number;
        title: string;
        description: string;
        category: string;
        price: number;
        discountPercentage: number;
        rating: number;
        stock: number;
        tags: string[];
        brand: string;
        sku: string;
        weight: number;
        dimension: {
          width: number;
          height: number;
          depth: number;
        };
        warranty: string;
        shipping: string;
        availability: string;
        reviews: {
          rating: number;
          comment: string;
          date: string;
          reviewerName: string;
          reviewerEmail: string;
        }[];
        returnPolicy: string;
        minimumOrderQuantity: number;
        meta: {
          createdAt: string;
          updatedAt: string;
          barcode: string;
          qrCode: string;
        };
        images: string[];
        thumbnail: string;
      }

      const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
      });
    

    const columns: ColumnDef<Product>[] = [
        {
          accessorKey: 'id',
          header: 'ID',
          cell: info => info.getValue() as number, // Casting ke number
        },
        {
          accessorKey: 'title',
          header: 'Product Name',
          cell: info => info.getValue() as string, // Casting ke string
        },
        {
          accessorKey: 'description',
          header: 'Description',
          cell: info => info.getValue() as string,
        },
        {
          accessorKey: 'category',
          header: 'Category',
          cell: info => info.getValue() as string,
        },
        {
          accessorKey: 'price',
          header: 'Price',
          cell: info => `$${(info.getValue() as number).toFixed(2)}`,
        },
        {
          accessorKey: 'discountPercentage',
          header: 'Discount Percentage',
          cell: info => `${(info.getValue() as number).toFixed(2)}`,
        },
        {
          accessorKey: 'rating',
          header: 'Rating',
          cell: info => `${info.getValue() as number} / 5`,
        },
        {
          accessorKey: 'stock',
          header: 'Stock',
          cell: info => {
            const stock = info.getValue() as number;
            return stock > 0 ? stock : 'Out of Stock';
          },
        },
        {
          accessorKey: 'tags',
          header: 'Tags',
          cell: info => {
            const tags = info.getValue() as string[];
            return tags.join(', ');
            },
        },
        {
            accessorKey: 'brand',
            header: 'Brand',
            cell: info => info.getValue() as string,
        },
        {
            accessorKey: 'sku',
            header: 'Sku',
            cell: info => info.getValue() as string,
        },
        {
            accessorKey: 'weight',
            header: 'Weight',
            cell: info => info.getValue() as number,
        },
        {
          accessorKey: 'dimension',
          header: 'Dimension',
          cell: info => {
            const dimensions = info.getValue() as Product['dimension'] | undefined;
            if (dimensions) {
              return `Width: ${dimensions.width ?? 'N/A'}, Height: ${dimensions.height ?? 'N/A'}, Depth: ${dimensions.depth ?? 'N/A'}`;
            }
            return 'No dimensions available';
          },
        },
        {
            accessorKey: 'warranty',
            header: 'warrantyInformation',
            cell: info => info.getValue() as string,
        },
        {
            accessorKey: 'shipping',
            header: 'shippingInformation',
            cell: info => info.getValue() as string,
        },
        {
            accessorKey: 'availability',
            header: 'availabilityStatus',
            cell: info => info.getValue() as string,
        },
        {
            accessorKey: 'reviews',
            header: 'Reviews',
            cell: info => {
            const reviews = info.getValue() as Product['reviews'];
            return reviews.map(review => (
                `rating: ${review.rating}, 
                comment: ${review.comment},
                date: ${review.date},
                reviewerName: ${review.reviewerName},
                reviewerEmail: ${review.reviewerEmail},
                `
            ))
        }},
        {
        accessorKey: 'returnPolicy',
        header: 'Return Policy',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'minimumOrderQuantity',
        header: 'Min Order Qty',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'meta',
        header: 'Meta Information',
        cell: info => {
          const meta = info.getValue() as Product['meta'];
          return `
          Created At: ${meta.createdAt}, 
          Updated At: ${meta.updatedAt}, 
          Barcode: ${meta.barcode}, 
          QR Code: ${meta.qrCode}
          `;
        },
      },
      {
        accessorKey: 'images',
        header: 'Images',
        cell: info => {
          const images = info.getValue() as Product['images'];
          return images.map((image, index) => (
            <img 
            key={index} 
            src={image} 
            alt={`Product Image ${index + 1}`} 
            style={{ width: '50px', height: '50px', marginRight: '5px' }} />
          ));
        },
      },
      {
        accessorKey: 'thumbnail',
        header: 'Thumbnail',
        cell: info => (
          <img src={info.getValue() as string} alt="Thumbnail" style={{ width: '50px', height: '50px' }} />
        ),
      },
      ];
      
      const table = useReactTable({
        data: data?.products ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
          globalFilter,
          columnFilters: categoryFilter ? [{ id: 'category', value: categoryFilter }] : [],
        },
        onGlobalFilterChange: setGlobalFilter,
      });
    
      if (isLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-red-800 font-medium">Error loading products</h3>
              <p className="text-red-600">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
            </div>
          </div>
        );
      }
      const categories = [...new Set(data?.products?.map((product: Product) => product.category))] as string[];

      return (
        <div className="p-4">
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="px-4 py-2 border rounded-lg"
            />
            
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map((category: string) => (
                <option key={category.toString()} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
    
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                {'<'}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                {'>>'}
              </button>
            </div>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
        </div>
      );
}

export default ProductTable;