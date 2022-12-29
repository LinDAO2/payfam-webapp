interface Props {
  space: number;
}
const Spacer = (props: Props) => {
  return <div style={{ marginTop: props.space }} />;
};

export default Spacer;
