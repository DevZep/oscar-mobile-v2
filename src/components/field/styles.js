import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  fieldContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    borderTopColor: '#EDEFF1'
  },
  field: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#009999',
  },
  fieldData: {
    fontSize: 18,
  },
  multipleFiledContainer: {
    flexDirection: 'row',
    backgroundColor: '#dedede',
    borderRadius: 2,
    padding: 4,
    marginBottom: 2
  },
  thumnail: {
    width: 35,
    height: 35,
    marginRight: 12
  }
});

export default styles;
