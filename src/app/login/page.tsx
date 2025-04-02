import BackgroundBlur from "@/components/BackgroundBlur";
import LoginForm from "@/components/LoginForm";
import About from "@/components/About";


export default function LoginPage() {
	return (
		<div className='flex flex-row items-center justify-center gap-36 min-h-dvh'>
				<BackgroundBlur />
				<About content='Зарегистрироваться' href='/register' />
				<LoginForm />
		</div>
	)
}