import BackgroundBlur from "@/components/svg/BackgroundBlur";
import LoginForm from "@/components/forms/LoginForm";
import About from "@/components/About";
import Logo from "@/components/svg/Logo";


export default function LoginPage() {
	return (
		<div className='flex flex-row items-center justify-center gap-36 min-h-dvh relative'>
				<Logo  className='self-start absolute top-1/24 left-1/11'/>
				<BackgroundBlur />
				<About content='Зарегистрироваться' question='У вас ещё нет аккаунта?' href='/register' />
				<LoginForm />
		</div>
	)
}