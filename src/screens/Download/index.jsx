import axios from 'axios'
import PropTypes from 'prop-types'
import { PureComponent, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import Error from '../../components/Error'
import Loading from '../../components/Loading'
import { API_URL } from '../../init'
import { axiosErrorHandling } from '../../utils'
import Link from './Link'
import styles from './styles'

const DownloadPage = ({ data }) => (
  <View style={styles.contentContainer}>
    <View style={styles.thumbnailContainer}>
      <View style={styles.shadow}>
        <Image
          source={{ uri: data.thumbnail }}
          resizeMode="contain"
          style={styles.thumbnail}
        />
      </View>
    </View>
    <Text style={styles.title}>{data.title}</Text>
    <Text style={styles.authors}>{data.authors}</Text>
    {data.description ? <Description description={data.description} /> : null}
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
  state = { loading: true, data: {}, error: '' }

  componentDidMount = () => this.getDownloadData()

  getDownloadData () {
    const onResponse = ({ data }) => this.setState({ data, loading: false })
    const onError = (error) => this.setState({
      error: axiosErrorHandling(error),
      loading: false
    })

    this.setState({ loading: true, error: '' })
    const params = { path: this.props.route.params.path }
    axios.get(`${API_URL}/download`, { params }).then(onResponse).catch(onError)
  }

  render = () => <>
    {this.state.loading
      ? <Loading message="Getting data..." />
      : this.state.error
        ? <Error
            message={this.state.error}
            onRetryPress={() => this.getDownloadData()} />
        : <ScrollView>
            <DownloadPage data={this.state.data} />
          </ScrollView>
    }
  </>
}
DownloadScreen.propTypes = { route: PropTypes.object.isRequired }

export default DownloadScreen
