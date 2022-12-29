import { getStatusColor } from "@/helpers/collection-helpers";
import { ICollectionDocumentStatus } from "@/types/collection-types";
import styled from "@emotion/styled";

type StatusProp = {
  bgColor: string;
};
const Wrapper = styled.div<StatusProp>`
  padding: 2px 5px;
  background-color: ${(props) => props.bgColor};
  width: fit-content;
  font-size: 0.6rem;
  font-family: Roboto;
  border-radius: 3px;
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
`;

interface Props {
  status: ICollectionDocumentStatus;
}
const ListItemStatus = ({ status }: Props) => {
  return <Wrapper bgColor={getStatusColor(status)}>{status}</Wrapper>;
};

export default ListItemStatus;
