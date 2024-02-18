import { SideMenu } from "@/components/SideMenu";
import { PostProvider } from "@/context/PostContext";
import { PostHandler } from "@/components/PostHandler";
import { ContainerS } from "@/components/ContainerS";

const Page = () => {
  return (
    <PostProvider>
      <ContainerS>
        <SideMenu />
        <PostHandler />
      </ContainerS>
    </PostProvider>
  );
}

export default Page;