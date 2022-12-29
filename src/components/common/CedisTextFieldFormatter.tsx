import { CEDIS_SYMBOL } from "@/constants/app";
import { forwardRef } from "react";
import { NumericFormat, InputAttributes } from "react-number-format";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const CedisTextFieldFormatter = forwardRef<
  typeof NumericFormat<InputAttributes>,
  CustomProps
>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator=","
      prefix={CEDIS_SYMBOL}
    />
  );
});

export default CedisTextFieldFormatter;
