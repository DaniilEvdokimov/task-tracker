import BackgroundBlur from "@/components/BackgroundBlur";
import LoginForm from "@/components/LoginForm";
import LoginAbout from "@/components/LoginAbout";


export default function Login() {
	return (
		<div className='flex flex-row items-center justify-center gap-36 min-h-dvh'>
				<BackgroundBlur />
				<LoginAbout />
				<LoginForm />
		</div>
	)
}