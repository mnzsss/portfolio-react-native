import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function loadRepos() {
      const res = await api.get("/repositories");

      setRepositories(res.data);
    }

    loadRepos();
  }, []);

  async function handleLikeRepository(id) {
    await api.post(`/repositories/${id}/like`);

    setRepositories(
      repositories.filter((repo) => {
        return repo.id === id ? (repo.likes += 1) : repo.likes;
      })
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#100f12" />

      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Projetos</Text>

        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map((tech) => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {`${repository.likes} curtidas`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#100f12",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    marginVertical: 30,
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#242424",
    borderRadius: 5,
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    backgroundColor: "#04d361",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#aaa",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#7159c1",
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    padding: 15,
  },
});
