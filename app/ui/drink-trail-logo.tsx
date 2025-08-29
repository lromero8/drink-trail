
import Image from 'next/image';

export default function DrinkTrailLogo() {
    return (
        <div className="flex flex-row items-center leading-none text-white">
            <Image
                src="/logo.png"
                width={60}
                height={60}
                className="w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
                alt="logo of Drink Trail"
            />
            <span className="text-[22px] md:text-[25px] whitespace-nowrap ml-1 mt-5">Drink Trail</span>
        </div>
    );
}
