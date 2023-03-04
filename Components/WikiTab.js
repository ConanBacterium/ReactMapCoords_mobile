import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableHighlight } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  distance: {
    fontSize: 16,
    color: '#999',
  },

  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
}
});

// TODO refactor out of this file? 
async function getNearbyArticles(lat, lng, radius = 10000) {
  const endpoint = 'https://en.wikipedia.org/w/api.php';
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    list: 'geosearch',
    gscoord: `${lat}|${lng}`,
    gsradius: radius,
    gslimit: 25,
    prop: 'extracts',
    exintro: 1,
    explaintext: 1
  });

  const response = await fetch(`${endpoint}?${params.toString()}`);
  if (response.ok) {
    const json = await response.json();
    const articles = json.query.geosearch;
    return articles;
  } else {
    throw new Error(`Request failed with status code ${response.status}`);
  }
}



const ArticleView = (props) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };
  return (
      <View style={styles.listItem}>
      <Text style={styles.title} onPress={(event) => {props.handleTitleClick(props.article)}}>{props.article.title}</Text>
      <Text style={styles.distance}>Dist: {props.article.dist}</Text>
    </View>

  )
}

export default function WikiTab() {
  const [location, updateLocation] = useLocation();
  const [articles, setArticles] = React.useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentArticle, setCurrentArticle] = useState(null);
  let webview = null
  const allowedUrls = ["wikipedia.org", "wikimedia.org"]
  
  async function getArticles() {
    const newLocation = await updateLocation()
    const newArticles = await getNearbyArticles(newLocation.coords.latitude, newLocation.coords.longitude);
    setArticles(newArticles)
  }

  function handleTitleClick(article) {
    setCurrentArticle(article)
    setCurrentUrl(`https://en.m.wikipedia.org/?curid=${article.pageid}`)
  }

  function generateArticleViews() {
    return articles.map((article) => {
      return <ArticleView key={article.pageid} article={article} handleTitleClick={handleTitleClick} />
    })
  }

  const handleWebViewNavigationStateChange = (newNavState) => {
    let allowed = false
    allowedUrls.forEach((url) => {
        if(newNavState.url.includes(url))  allowed = true 
    })
    if (allowed) return 
    const redirectTo = 'window.location = "wikipedia.org"';
    webview.injectJavaScript(redirectTo);
}

  return (
    <>
    <View style={styles.container}>
      <ScrollView>
        {generateArticleViews()}
      </ScrollView>
      <Button title="Get Nearby Articles" onPress={() => {getArticles()}} />
    </View>
    <View style={{flex: 1} }>
      {currentUrl && <WebView source={{ uri: currentUrl}}
                onNavigationStateChange={handleWebViewNavigationStateChange}
              ref={ref => (webview = ref)}
          />}
          

            
    </View>
    </>
  )
}
