import {
  Link,
  BlitzPage,
  useMutation,
  AuthenticationError,
  useQuery,
} from 'blitz';
import Layout from 'app/layouts/Layout';
import logout from 'app/auth/mutations/logout';
import { useCurrentUser } from 'app/hooks/useCurrentUser';
import React, { Suspense } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
  Stack,
  Box,
  Heading,
  Text,
} from 'minerva-ui';
import Form, { FORM_ERROR } from 'app/components/Form';
import LabeledTextField from 'app/components/LabeledTextField';
import createFeature from 'app/features/mutations/createFeature';
import getFeatures from 'app/features/queries/getFeatures';

const FeatureList = () => {
  const [{ features }] = useQuery(
    getFeatures,
    {
      orderBy: { updatedAt: 'desc' },
    },
    {
      // initialData,
    }
  );

  return (
    <Box>
      {features?.map((feature) => (
        <Box key={feature.id} mb={6}>
          <Link href={`/features/${feature.id}`}>
            <a>
              <Heading
                as="h2"
                color="gray.900"
                fontSize="lg"
                fontWeight="500"
                mb={2}
              >
                {feature.title}
              </Heading>
            </a>
          </Link>
          <Text
            fontWeight={400}
            color="gray.600"
            fontSize="base"
            lineHeight={1}
          >
            {feature.description}
          </Text>
          <Flex justifyContent="space-between" mt={2} alignItems="flex-end">
            <Link href={`/features/${feature.id}`}>
              <a>
                <Text color="gray.500" fontSize="base">
                  {/* {feature.posts.length} Comments */}
                </Text>
              </a>
            </Link>

            <Text color="gray.400" fontSize="xs">
              {feature.author?.name}
            </Text>
          </Flex>
        </Box>
      ))}
    </Box>
  );
};

const FeatureModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [featureMutation] = useMutation(createFeature);

  return (
    <>
      <Button onClick={onOpen}>Create Feature</Button>
      <Modal isOpen={isOpen} onClose={onClose} overflow="hidden">
        <ModalHeader onClose={onClose}>Create New Feature</ModalHeader>

        <Form
          initialValues={{ title: '', description: '' }}
          resetFormOnSubmit
          onSubmit={async (values) => {
            try {
              await featureMutation({ data: values });
              // props.onSuccess?.();
            } catch (error) {
              if (error instanceof AuthenticationError) {
                return {
                  [FORM_ERROR]: 'Sorry, those credentials are invalid',
                };
              } else {
                return {
                  [FORM_ERROR]:
                    'Sorry, we had an unexpected error. Please try again. - ' +
                    error.toString(),
                };
              }
            }
          }}
        >
          <ModalBody>
            <Stack>
              <LabeledTextField name="title" label="Title" />
              <LabeledTextField name="description" label="Description" />
            </Stack>
          </ModalBody>
          <ModalFooter px={6} py={3} bg="gray.50">
            <Flex flexDirection={['column', 'row-reverse']} radiusBottom="5px">
              <Button type="submit" boxShadow="base" width={['100%', 'auto']}>
                Create Feature
              </Button>
            </Flex>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser();
  const [logoutMutation] = useMutation(logout);

  if (currentUser) {
    return (
      <>
        <Button
          className="button small"
          onClick={async () => {
            await logoutMutation();
          }}
        >
          Logout
        </Button>
        <div>
          {currentUser.name}
          <br />
          {currentUser.email}
        </div>
        <FeatureModal />
        <FeatureList />
      </>
    );
  } else {
    return <Link href="/api/auth/google">Log In With Google</Link>;
  }
};

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <div
          className="buttons"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
