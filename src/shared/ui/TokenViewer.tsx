export default function TokenViewer({ data }: { data: any }) {
  return (
    <pre
      style={{
        background: "#eee",
        padding: 10,
        borderRadius: 5,
        maxWidth: 600,
        overflowX: "auto",
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
