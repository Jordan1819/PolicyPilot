# PolicyPilot (Working Title)

## Overview

PolicyPilot is a Retrieval-Augmented Generation (RAG) application built
to simulate the type of AI knowledge assistant used within an enterprise
or government environment.

The idea is simple: instead of employees manually searching through
lengthy policy documents, they can ask natural language questions and
receive AI-generated answers that are grounded in official
documentation.

This project is inspired by an interview recommendation to gain hands-on
experience with RAG and Google's Gemini ecosystem.

------------------------------------------------------------------------

## Goals

-   Learn RAG through implementation
-   Gain experience with the Gemini API
-   Understand embeddings and vector databases
-   Build a portfolio-quality AI application
-   Simulate the type of work performed by AI implementation consultants

------------------------------------------------------------------------

## Tech Stack

-   Frontend: React
-   Backend: FastAPI (Python)
-   LLM: Google Gemini
-   Embeddings: Gemini Embedding API
-   Database: Supabase PostgreSQL + pgvector
-   Document Processing: LangChain (or equivalent PDF loader)

------------------------------------------------------------------------

## MVP Features

-   Upload PDF policy documents
-   Extract and chunk document text
-   Generate embeddings
-   Store embeddings in Supabase (pgvector)
-   Ask questions in natural language
-   Retrieve relevant document chunks using semantic search
-   Send retrieved context to Gemini
-   Display grounded answers with source citations

------------------------------------------------------------------------

## Example Workflow

1.  User uploads:
    -   Employee Handbook
    -   Travel Policy
    -   PTO Policy
    -   Security Policy
2.  Backend:
    -   Reads PDFs
    -   Chunks text
    -   Generates embeddings
    -   Stores vectors
3.  User asks:

> "How much PTO do employees receive?"

4.  System:
    -   Converts question into an embedding
    -   Finds semantically similar chunks
    -   Builds a prompt with retrieved context
    -   Sends prompt to Gemini
5.  Gemini responds with an answer and cites the relevant document(s).

------------------------------------------------------------------------

## Architecture

User → React Frontend → FastAPI Backend → Gemini Embedding API →
Supabase (pgvector) → Retrieve Relevant Chunks → Gemini LLM → Response +
Citations

------------------------------------------------------------------------

## Concepts Practiced

-   Retrieval-Augmented Generation (RAG)
-   Prompt Engineering
-   Embeddings
-   Semantic Search
-   Vector Databases
-   Chunking
-   Context Grounding
-   AI Output Validation
-   FastAPI
-   React
-   Supabase
-   Gemini API

------------------------------------------------------------------------

## Learning Philosophy

The objective is not just to finish the project, but to understand every
component.

Development workflow:

1.  Learn the concept.
2.  Design the solution.
3.  Implement with AI as a pair programmer.
4.  Explain the implementation.
5.  Refactor or extend.

AI should accelerate learning---not replace it.

------------------------------------------------------------------------

## Possible Phase 2

Add an "AI Workflow Consultant" page where users describe a business
process and Gemini suggests:

-   Automation opportunities
-   Prompt ideas
-   AI implementation recommendations
-   Suggested workflow

This better reflects the responsibilities of an AI Prompt Engineer
helping stakeholders adopt AI.

------------------------------------------------------------------------

## Interview Takeaway

By completing this project, I should be able to confidently discuss:

-   Building a complete RAG pipeline
-   Using Gemini for embeddings and generation
-   Implementing semantic search with pgvector
-   Grounding AI responses using retrieved documents
-   Applying AI to solve practical business problems
