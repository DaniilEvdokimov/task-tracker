import Image from "next/image";
import Link from "next/link";

interface AvatarProps {
    username: string;
    avatarUrl: string;
}

export function Avatar({ username, avatarUrl }: AvatarProps) {
    return (
        <Link
            href="/user/settings"
            className="flex items-center gap-3 px-4 py-5 hover:bg-gray-100 transition-colors duration-200 absolute bottom-0 left-0 right-0"
        >
            <div className="rounded-[46px] overflow-hidden w-10 h-10 flex-shrink-0">
                {/*<Image*/}
                {/*    src={avatarUrl}*/}
                {/*    alt="User avatar"*/}
                {/*    width={40}*/}
                {/*    height={40}*/}
                {/*    className="object-cover w-full h-full"*/}
                {/*/>*/}

                {/* Заглушка вместо аватарки */}
                <div className="rounded-[46px] w-10 h-10 flex-shrink-0 bg-black" />
            </div>
            <span className="font-inter text-base leading-6 tracking-normal">
                {username}
            </span>
        </Link>
    );
}
