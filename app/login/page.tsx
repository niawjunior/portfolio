import Image from "next/image";

const Login = () => {
  return (
    <div className="h-screen gap-2 flex items-center justify-between bg-[#F8F8F8] p-4">
      <div className="w-1/2 pr-[100px]">
        <div className="text-[34px] font-bold text-black text-center">
          Welcome back
        </div>
        <div className="text-[14px] text-[#636364] text-center">
          Welcome back! Please enter your details.
        </div>
        <div className="mt-8">
          <label className="text-[#181818]">Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            className="w-full p-2 border border-[#C4C4C4] text-[#636364] rounded-[12px] focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>
        <div className="mt-8">
          <label className="text-[#181818]">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={111111}
            className="w-full p-2 border border-[#C4C4C4] text-[#636364] rounded-[12px] focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        <div className="flex justify-between text-[#181818] text-[12px] mt-4">
          <div className="flex items-center gap-2 border-[#C4C4C4] rounded-[4px] outline-[#C4C4C4]">
            <input type="checkbox" />
            <span>Remember me</span>
          </div>
          <div>Forgot password</div>
        </div>
        <div className="bg-[#EA454C] mt-4 rounded-[12px] h-[42px] text-[14px] text-white flex items-center justify-center font-bold">
          Sign in
        </div>

        <div className="bg-white flex items-center gap-2 mt-4 rounded-[12px] h-[42px] border border-[#C4C4C4] text-[14px] text-black flex items-center justify-center font-bold">
          <Image src="/google-icon.png" alt="google" width={24} height={24} />
          Sign in with Google
        </div>
        <div className="text-[12px] text-[#636364] mt-4 text-center">
          Don&apos;t have an account?{" "}
          <a className="text-[#EA454C]" href="/register">
            Sign up fo free!
          </a>
        </div>
      </div>
      <div className="w-1/2">
        <Image
          src="/background-image.png"
          alt="background-image"
          width={600}
          height={800}
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
