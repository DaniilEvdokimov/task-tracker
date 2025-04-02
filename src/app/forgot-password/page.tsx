import BackgroundBlur from "@/components/svg/BackgroundBlur";
import About from "@/components/About";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import Logo from "@/components/svg/Logo";

export default function ForgotPasswordPage() {


	return (
		<div className='flex flex-row items-center justify-center gap-36 min-h-dvh relative'>
			<Logo className='self-start absolute top-1/24 left-1/11'/>
			<BackgroundBlur />
			<About content='Войти в аккаунт' question='Вспомнили пароль?' href='/login' />
			<ForgotPasswordForm />
		</div>

	)
}