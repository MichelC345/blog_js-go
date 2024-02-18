import "../styles/tag.css";
import Link from "next/link";

type TagType = {
    name: string;
}

export const Tag = (props: TagType) => {
    return(
        <Link href="/category/[category]" as={`/category/${props.name}`} className="tag">
            <div className="flex items-center justify-center h-full">
                #{props.name}
            </div>
        </Link>
    );
}