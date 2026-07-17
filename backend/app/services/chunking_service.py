from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_text(text:str) -> list[str]:
    """
    Split extracted text into overlapping chunks for embedding
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=900,
        chunk_overlap=200,
        length_function=len,
    )

    return splitter.split_text(text)
