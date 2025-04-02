const Logo = ({ className = '', size = 40, shadow = true }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 40 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`${shadow ? 'drop-shadow-sm' : ''} ${className}`}
		>
			<g id="T-letter-logo">
				{/* Темно-серая тень (задний слой) */}
				<path
					d="M6.154 12.308V3.077H40V12.308H27.692V40H18.462V12.308H6.154Z"
					fill="#4B5563"
				/>
				{/* Синяя буква T (передний слой) */}
				<path
					d="M0 9.231V0h33.846v9.231H21.539v27.692h-9.23V9.231H0Z"
					fill="#3B82F6"
				/>
			</g>
		</svg>
	);
};

export default Logo;