import Link from "next/link";

interface AvatarProps {
    username: string;
    avatarUrl?: string;
}

export function Avatar({ username, avatarUrl }: AvatarProps) {
    return (
        <Link
            href="/user/settings"
            className="flex items-center gap-3 px-4 py-5 hover:bg-gray-100 transition-colors duration-200 absolute bottom-0 left-0 right-0"
        >
            <div className="rounded-[46px] overflow-hidden w-10 h-10 flex-shrink-0 relative">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="User avatar"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            // Если изображение не загрузилось, скрываем его и показываем заглушку
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) {
                                fallback.style.display = 'flex';
                            }
                        }}
                    />
                ) : null}

                {/* Заглушка - показывается если нет avatarUrl или если изображение не загрузилось */}
                <div
                    className={`rounded-[46px] w-10 h-10 flex-shrink-0 bg-black flex items-center justify-center text-white text-sm font-semibold absolute inset-0 ${
                        avatarUrl ? 'hidden' : 'flex'
                    }`}
                >
                    {username ? username.charAt(0).toUpperCase() : '?'}
                </div>
            </div>
            <span className="font-inter text-base leading-6 tracking-normal">
                {username}
            </span>
        </Link>
    );
}
