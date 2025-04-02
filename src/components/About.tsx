import Link from "next/link";
type TAboutProps = {
	content: string;
	question: string
	href: string;
}

export default function About({content, question, href}: TAboutProps)
 {
	return (
		<div className='flex flex-col items-left justify-between  gap-5 mt-9 pr-5'>
			<h1>TaskTrack</h1>
			<p className='text-2xl'>
				Максимум контроля и эффективности: <br/>
				Управляйте проектами, задачами и  <br/>командами в одном месте.
				Легко.<br/> Удобно. Прозрачно.
			</p>
			<div className='block text-sm pt-5'>
				<p className='text-gray-500'>{question}</p>
				<Link href={href} className='text-blue-600 font-bold'>{content}</Link>
			</div>
		</div>
	)
}