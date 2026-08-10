type Props = {
  success?: string;
  error?: string;
};

export function StatusAlert({ success, error }: Props) {
  return (
    <>
      {success ? <div className="alert alert-success">{success}</div> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}
    </>
  );
}
