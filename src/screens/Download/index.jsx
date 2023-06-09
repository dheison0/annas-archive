import axios from 'axios'
import PropTypes from 'prop-types'
import { PureComponent, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import Error from '../../components/Error'
import Loading from '../../components/Loading'
import { API_URL } from '../../init'
import { axiosErrorHandling } from '../../utils'
import Link from './Link'
import ShareButton from './ShareButton'
import styles from './styles'

const DownloadPage = ({ data }) => (
  <View style={styles.contentContainer}>
    <View style={styles.thumbnailContainer}>
      <View style={styles.shadow}>
        <Image
          resizeMode="contain"
          source={{ uri: data.thumbnail }}
          style={styles.thumbnail}
        />
      </View>
    </View>
    <Text style={styles.title}>{data.title}</Text>
    <Text style={styles.authors}>{data.authors}</Text>
    {data.description && <Description description={data.description} />}
    <View style={styles.downloads}>
      <DownloadLinks links={data.download_links} />
    </View>
  </View>
)
DownloadPage.propTypes = { data: PropTypes.object.isRequired }

const Description = ({ description }) => {
  const [expanded, setExpanded] = useState(false)
  const visibleDescription = expanded ? description : description.slice(0, 750) + '...'
  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <Text style={styles.description}>
        {'   • ' + visibleDescription}
      </Text>
    </TouchableOpacity>
  )
}
Description.propTypes = { description: PropTypes.string.isRequired }

const DownloadLinks = ({ links }) => links.map(
  (item, index) => (<Link key={index} {...item} />)
)

class DownloadScreen extends PureComponent {
  state = { loading: true, data: {}, error: null }

  constructor (props) {
    super(props)
    this.props.navigation.setOptions({
      headerRight: () => (
        <ShareButton
          path={this.props.route.params.path}
          title={this.props.route.params.title} />
      )
    })
  }

  componentDidMount = () => this.getDownloadData()

  getDownloadData = async () => {
    this.setState({ loading: true, error: null })
    let response
    try {
      response = await axios.get(
        `${API_URL}/download`,
        { params: { path: this.props.route.params.path } }
      )
    } catch (error) {
      return this.setState({ error: axiosErrorHandling(error), loading: false })
    }
    this.setState({ data: response.data, loading: false })
  }

  render = () => <>
    {this.state.loading
      ? <Loading message="Getting data..." />
      : this.state.error
        ? <Error
            message={this.state.error}
            onRetryPress={this.getDownloadData} />
        : <ScrollView>
            <DownloadPage data={this.state.data} />
          </ScrollView>
    }
  </>
}
DownloadScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
}

export default DownloadScreen
