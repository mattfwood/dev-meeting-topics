import {
  Link,
  BlitzPage,
  useMutation,
  AuthenticationError,
  useQuery,
  invalidateQuery,
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
} from 'minerva-ui';
import Form, { FORM_ERROR } from 'app/components/Form';
import LabeledTextField from 'app/components/LabeledTextField';
import createFeature from 'app/features/mutations/createFeature';
import getFeatures from 'app/features/queries/getFeatures';
import createVote from 'app/votes/mutations/createVote';
import { Feature, FeatureWithAuthor } from '../components/Feature';
import updateFeature from 'app/features/mutations/updateFeature';
import { Feature as FeatureType } from 'db';

const FeatureList = () => {
  const [{ features }, { refetch }]: [
    { features: FeatureWithAuthor[] },
    any
  ] = useQuery(
    getFeatures,
    // @ts-ignore
    {
      orderBy: { updatedAt: 'desc' },
    },
    {
      // initialData,
    }
  );

  const sortedFeatures = features.sort((a, b) => {
    return b.votes.length - a.votes.length;
  });

  const [voteMutation] = useMutation(createVote);

  const handleClick = async (featureId: number) => {
    await voteMutation({
      data: { featureId },
    });

    await refetch();
  };

  return (
    <Box my={2} pt={2}>
      {sortedFeatures?.map((feature) => {
        return (
          <Feature
            key={feature.id}
            feature={feature}
            onVote={async () => await handleClick(feature.id)}
            refetch={refetch}
          />
        );
      })}
    </Box>
  );
};

type FeatureFields = Pick<FeatureType, 'id' | 'title' | 'description'>;

export const FeatureForm = ({
  initialValues,
  onSuccess,
}: {
  initialValues?: FeatureFields;
  onSuccess?: () => void;
}) => {
  const [createFeatureMutation] = useMutation(createFeature);
  const [updateFeatureMutation] = useMutation(updateFeature);

  const isEditing = Boolean(initialValues);

  return (
    <Form
      initialValues={initialValues || { title: '', description: '' }}
      resetFormOnSubmit
      onSubmit={async (values: FeatureFields) => {
        try {
          if (isEditing) {
            const { id, title, description } = values;
            await updateFeatureMutation({
              where: { id },
              data: { title, description },
            });
          } else {
            await createFeatureMutation({ data: values });
          }
          await invalidateQuery(getFeatures);
          onSuccess?.();
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
          <Button type="submit" width={['100%', 'auto']} variant="primary">
            {isEditing ? 'Update' : 'Create'} Topic
          </Button>
        </Flex>
      </ModalFooter>
    </Form>
  );
};

const FeatureModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button variant="primary" onClick={onOpen}>
        Add Topic
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} overflow="hidden">
        <ModalHeader onClose={onClose}>Create a Topic</ModalHeader>
        <FeatureForm onSuccess={onClose} />
        {/* <Form
          initialValues={{ title, description }}
          resetFormOnSubmit
          onSubmit={async (values) => {
            try {
              await featureMutation({ data: values });
              // props.onSuccess?.();
              await invalidateQuery(getFeatures);
              onClose();
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
              <Button type="submit" width={['100%', 'auto']} variant="primary">
                Create Topic
              </Button>
            </Flex>
          </ModalFooter>
        </Form> */}
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
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <FeatureModal />
          </Box>
          <Flex alignItems="center">
            <div>{currentUser.name}</div>
            <Button
              variant="secondary"
              ml={2}
              className="button small"
              onClick={async () => {
                await logoutMutation();
              }}
            >
              Logout
            </Button>
          </Flex>
        </Flex>

        <FeatureList />
      </>
    );
  } else {
    return (
      <Link href="/api/auth/google">
        <Button as="a" variant="primary">
          Log In With Google
        </Button>
      </Link>
    );
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
