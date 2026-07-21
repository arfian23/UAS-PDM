from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_documents():

    knowledge_path = Path(__file__).parent.parent / "knowledge"

    print("=" * 50)
    print("SMART SCHEDULER AI")
    print("Knowledge Loader")
    print("=" * 50)

    print(f"Knowledge Path : {knowledge_path}")
    print(f"Folder Exists : {knowledge_path.exists()}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    documents = []

    for file in knowledge_path.glob("*.txt"):

        print(f"Membaca : {file}")

        text = file.read_text(
            encoding="utf-8"
        )

        chunks = splitter.split_text(text)

        print(f"   -> {len(chunks)} Chunk")

        for chunk in chunks:

            documents.append({
                "filename": file.name,
                "content": chunk
            })

    print("\n=============================")
    print(f"Total Chunk : {len(documents)}")
    print("=============================\n")

    return documents


if __name__ == "__main__":

    docs = load_documents()

    print(docs[0])