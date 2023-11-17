// import React from "react";
// import { StyleProp, TextStyle, View, ViewProps } from "react-native"
// import { DEFAULT } from "../common";
// import NumberButton from "./NumberButton";

// const NumbersPanel = ({ style, buttonStyle, onButtonPress, textStyle, rowStyle, disabled, backSpaceText, backSpace }: {
//     buttonStyle?: StyleProp<ViewProps>;
//     onButtonPress: (value: string) => void;
//     style?: StyleProp<ViewProps>;
//     textStyle?: StyleProp<TextStyle>;
//     rowStyle?: StyleProp<TextStyle>;
//     disabledStyle?: StyleProp<TextStyle>;
//     backSpace?: JSX.Element;
//     backSpaceText?: string;
//     disabled?: boolean;
// }) => {
//     return <View style={[DEFAULT.Styles.enter?.buttonContainer, style]}>
//         <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
//             <NumberButton value={'1'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//             <NumberButton value={'2'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//             <NumberButton value={'3'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//         </View>
//         <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
//             <NumberButton value={'4'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//             <NumberButton value={'5'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//             <NumberButton value={'6'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//         </View>
//         <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
//             <NumberButton value={'7'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//             <NumberButton value={'8'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//             <NumberButton value={'9'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//         </View>
//         <View style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
//             <View style={[DEFAULT.Styles.enter?.button, buttonStyle, { backgroundColor: 'transparent', borderWidth: 0 }]} />
//             <NumberButton value={'0'} disabled={disabled} style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//             <NumberButton value={'delete'} disabled={disabled}
//                 backSpace={backSpace} backSpaceText={backSpaceText || DEFAULT.TextOptions.set?.backSpace}
//                 style={buttonStyle} textStyle={textStyle} onPress={onButtonPress} />
//         </View>
//     </View>
// }

// export default NumbersPanel;

import React from "react";
import { StyleProp, TextStyle, View, ViewProps } from "react-native";
import { DEFAULT } from "../common";
import NumberButton from "./NumberButton";


const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9","0"];
const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);

const group = ({ array, number }: { array: any[]; number: number }) => {
    if (number < 1) {
      return array;
    }
    const grouped = [];
    let y = 0;
    const limit = Math.ceil(array.length / number);
    for (let i = 0; i < limit; i += 1) {
      const g = [];
      for (let index = y; index < y + number; index += 1) {
        if (array[index]) {
          g.push(array[index]);
        }
      }
      y += number;
      grouped.push(g);
    }

    return grouped;
  };

const NumbersPanel = ({
  style,
  buttonStyle,
  onButtonPress,
  textStyle,
  rowStyle,
  disabled,
  backSpaceText,
  backSpace,
  randomPositions,
}: {
  buttonStyle?: StyleProp<ViewProps>;
  onButtonPress: (value: string) => void;
  style?: StyleProp<ViewProps>;
  textStyle?: StyleProp<TextStyle>;
  rowStyle?: StyleProp<TextStyle>;
  disabledStyle?: StyleProp<TextStyle>;
  backSpace?: JSX.Element;
  backSpaceText?: string;
  disabled?: boolean;
  randomPositions?: boolean;
}) => {

  const positions = group({
    array: randomPositions ? shuffledNumbers : numbers,
    number: 3,
  });

  return (
    <View style={[DEFAULT.Styles.enter?.buttonContainer, style]}>
      {positions.map((row, index, arr) => {
        return (
          <View key={index} style={[DEFAULT.Styles.enter?.buttonRow, rowStyle]}>
            {index === arr.length - 1 && <View
          style={[
            DEFAULT.Styles.enter?.button,
            buttonStyle,
            { backgroundColor: "transparent", borderWidth: 0 },
          ]}
        /> }
            {row.map((value: string) => {
              return (
                <NumberButton
                  key={value}
                  value={value}
                  disabled={disabled}
                  style={buttonStyle}
                  textStyle={textStyle}
                  onPress={onButtonPress}
                />
              );
            })}
            {index === arr.length - 1 &&  (
                <NumberButton
                    value={"delete"}
                    disabled={disabled}
                    backSpace={backSpace}
                    backSpaceText={backSpaceText || DEFAULT.TextOptions.set?.backSpace}
                    style={buttonStyle}
                    textStyle={textStyle}
                    onPress={onButtonPress}
                /> 
            )}
          </View>
        );
      })}
    </View>
  );
};

export default NumbersPanel;
