type ProductsForCookingProps = {
    products?: {
        name: string;
        quantity: number;
        unit: 'шт' | 'г' | 'мл' | 'ст.л' | 'ч.л' | 'ст';
    }[];
    portions?: number
};

export default function ProductsForCooking({ products, portions }: ProductsForCookingProps) {
    return (
        <div className="w-[100%] mt-7"> {/* Продукты для приготовления */}
            <div className="flex flex-col gap-3">
                <h3 className='font-montserrat text-[24px] md:text-[28px] font-bold tracking-[0.2px] leading-7'>ПРОДУКТЫ ДЛЯ ПРИГОТОВЛЕНИЯ</h3>
                <span className='font-montserrat text-[16px] md:text-[20px] text-[#000000] font-semibold tracking-[0.2px] leading-7'>Порций: {portions}</span>
            </div>
            <div className="">
                {products?.map((product, idx) => (
                    <div key={idx} className="flex justify-between py-3 border-b-[1px] border-dashed border-[#737373]">
                        <span className='font-montserrat text-[16px] text-[#000000] tracking-[0.2px] underline'>{product.name}</span>
                        <span className='font-montserrat text-[16px] text-[#000000] tracking-[0.2px]'>
                            {product.quantity} {product.unit}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}