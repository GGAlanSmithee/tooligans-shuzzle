import Link from "next/link";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";

const NewGameButton = ({ solved }) => {
  const { push } = useRouter();

  const navigate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const id = uuid();

    push(`/?id=${id}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#eee",
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/">
        <div
          title="new game"
          onClick={navigate}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#333",
            fontSize: "15rem",
            cursor: "pointer",
          }}
        >
          <span>&#127918;</span>
        </div>
      </Link>
    </div>
  );
};

export { NewGameButton };
