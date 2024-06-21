import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="h-full">
      <Link href="/">
        <div className="h-full hidden sm:block">
          <Image
            src="/images/betty_logo.png"
            alt="Betty Logo"
            width={48}
            height={48}
            priority
          />
        </div>
        <div className="h-full block sm:hidden min-w-8">
          <Image
            src="/images/betty_logo.png"
            alt="Betty Logo"
            width={36}
            height={36}
            priority
          />
        </div>
      </Link>
    </div>
  );
};

export default Logo;
