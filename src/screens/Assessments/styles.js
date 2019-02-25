import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF1',
    padding: 20
  },
  disableAssessmentWrapper: {
    borderColor: '#7d7f83',
    backgroundColor: '#97999c',
  },
  disableLabel: {
    color: '#75777a',
    fontWeight: 'bold',
    fontSize: 18
  },
  disableValue: {
    color: '#75777a',
    marginTop: 5
  },
  nextAssessmentWrapper: {
    borderColor: '#fff',
    backgroundColor: '#1ab394',
  },
  assessmentWrapper: {
    borderWidth: 3,
    borderRadius: 15,
    elevation: 15,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#000',
    shadowOpacity: 0.3,
    marginBottom: 15,
    borderColor: '#fff',
    backgroundColor: '#009999',
  },
  assessmentContainer: {
    padding: 20
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  value: {
    color: '#fff',
    marginTop: 5
  }
})

export default styles