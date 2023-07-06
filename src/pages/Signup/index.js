import { useContext, useEffect } from "react";
import { Box } from "@chakra-ui/layout";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";

import { Link as ReactRouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { signupResolver } from "../../utils/validator/signupResolver";
import { auth, db } from "../../utils/firebase";
import { AuthContext } from "../../components/Authentication/AuthProvider";
import generateId from "../../utils/generateId";

const Signup = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({ resolver: signupResolver });

  const history = useHistory();

  const { user } = useContext(AuthContext);

  const onSubmit = ({ username, email, password }) => {
    clearErrors("API_ERROR");
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        history.push("/");
        // db.collection("users").add()
        // Add a new document in collection "cities"
        const id = generateId();
        const finalDoc = {
          name: username.toUpperCase(),
          email: email,
          userId: resp.user.uid,
        }
        console.log("ID", id);
        console.log(finalDoc);
        db.collection("users").add(finalDoc)
          .then((ref) => {
            console.log("Document successfully written!", ref.id);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      })
      .catch((err) => {
        setError("API_ERROR", {
          message: err.message,
        });
      });
  };

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  return (
    <Box
      width="100%"
      minH="100vh"
      // background="gray.200"
      d="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box width={{ base: "90%", md: "40%", lg: "30%" }} shadow="lg" background="white" p={12} rounded={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.username}>
            <FormLabel htmlFor="username">Name</FormLabel>
            <Input
              type="text"
              name="username"
              placeholder="Enter your Full Name"
              {...register("username")}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl marginTop="2" isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl marginTop="2" isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter your Password"
              {...register("password")}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl mt="2" isInvalid={errors.repeat_password}>
            <FormLabel htmlFor="repeat_password">Repeat Password</FormLabel>
            <Input
              type="password"
              name="repeat_password"
              placeholder="Enter your password"
              {...register("repeat_password")}
            />
            <FormErrorMessage>
              {errors.repeat_password && errors.repeat_password.message}
            </FormErrorMessage>
          </FormControl>

          <Box mt="5" color="red.500">
            {errors.API_ERROR && errors.API_ERROR.message}
          </Box>

          <Button
            isLoading={isSubmitting}
            mt={4}
            colorScheme="messenger"
            type="submit"
            w="100%"
          >
            Sign up
          </Button>

          <Text textAlign="center" p="2" size="xs">
            <Link as={ReactRouterLink} color="gray.500" to="/login">
              Already registered?
            </Link>
          </Text>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
