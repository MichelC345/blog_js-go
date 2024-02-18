//import "../styles/tag.css";
import Link from "next/link";

type AuthorType = {
    name: string;
}

export const Author = (props: AuthorType) => {
    return(
        <Link href="/author/[author]" as={`/author/${props.name}`} className="author">
            @{props.name}
        </Link>
    );
}