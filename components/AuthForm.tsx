// "use client"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import {Form, FormField} from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import Image from "next/image";
// import Link from "next/link";
// import {toast} from "sonner";
//
// // const formSchema = z.object({
// //     username: z.string().min(2).max(50),
// // })
//
// const authFormSchema = (type : FormType) => {
//     return z.object({
//         name : type === 'sign-up' ? z.string().min(3) : z.string().optional(),
//         email : z.string().email(),
//         password: z.string().min(3),
//     })
// }
//
// const AuthForm = ({ type } : { type: FormType }) => {
//     const formSchema = authFormSchema(type);
//     // 1. Define your form.
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             name: "",
//             email: "",
//             password: "",
//         },
//     })
//
//     // 2. Define a submit handler.
//     function onSubmit(values: z.infer<typeof formSchema>) {
//         try{
//             if(type === "sign-up"){
//                 console.log('SIGN UP' , values);
//             }else {
//                 console.log('SIGN IN' , values);
//
//             }
//
//         }catch(error){
//             console.log(error);
//             toast.error(`There was an error : ${error}`);
//
//         }
//     }
//     const isSignIn = type === "sign-in";
//     return (
//         <div className="card-border lg:min-w-[566px]">
//             <div className="flex flex-col gap-6 card py-14 px-10">
//                 <div className="flex flex-row gap-2 justify-center"></div>
//                     <Image src="/logo.svg" alt="Logo" height={32} width={38} />
//                 <h2 className="text-primary-100">PrepPilot</h2>
//                 <h3>Practice Job Interview with AI</h3>
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form ">
//                     {!isSignIn && (
//                         <FormField
//                             control = {form.control}
//                             name = "name"
//                             label = "Name"
//                             placeholder = "Your Name"
//                         />
//                     )}
//                     <FormField
//                         control = {form.control}
//                         name = "email"
//                         label = "Email"
//                         placeholder = "Your Email Address"
//                         type = "email"
//                     />
//                     <FormField
//                         control = {form.control}
//                         name = "password"
//                         label = "Password"
//                         placeholder = "Enter Your Password"
//                         type = "password"
//                     />
//
//
//
//                     <Button className="btn" type="submit">
//                         {isSignIn ? 'Sign in' : 'Create an Account'}
//                     </Button>
//                 </form>
//             </Form>
//
//                 <p className="text-center">
//                     {isSignIn ? 'No account yet?' : 'Have an account already yet?'}
//
//                     <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
//                     {!isSignIn ? "Sign in" : "Sign up"}
//                 </Link>
//
//                 </p>
//
//         </div>
//         </div>
//     )
// }
// export default AuthForm

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import {signIn, signUp} from "@/lib/actions/auth.action";
import {createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";

// You'll need to define this type somewhere
type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type === "sign-up"){

                const { name, email,password } = values;
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password );
                const result = await signUp({
                    uid : userCredentials.user.uid,
                    name : name!,
                    email ,
                    password,
                })

                if(!result?.success){
                    toast.error(result?.message);
                    return ;
                }
                toast.success("Account Created Successfully . Please Sign In");
                router.push("/sign-in");
            }else {
                const { email, password } = values;
                const userCredential = await signInWithEmailAndPassword(auth, email, password );
                const idToken = await userCredential.user.getIdToken();
                if(!idToken){
                    toast.error("Sign in failed");
                    return ;
                }

                await signIn({
                    email,idToken
                })

                toast.success("Sign In Successfully . ");
                router.push("/");
            }
        }catch(error){
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="Logo" height={32} width={38} />
                    <h2 className="text-primary-100">PrepPilot</h2>
                </div>
                <h3>Practice Job Interview with AI</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Your Email Address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter Your Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="btn" type="submit">
                            {isSignIn ? 'Sign in' : 'Create an Account'}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? 'No account yet?' : 'Have an account already?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                        {!isSignIn ? "Sign in" : "Sign up"}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm




