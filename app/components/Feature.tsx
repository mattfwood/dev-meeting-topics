import { useCurrentUser } from 'app/hooks/useCurrentUser';
import React, { useState } from 'react';
import {
  Button,
  Flex,
  Box,
  Heading,
  Text,
  // Image,
  MenuContainer,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalHeader,
} from 'minerva-ui';
import deleteFeature from 'app/features/mutations/deleteFeature';
import { useMutation } from '@blitzjs/core';
import { Feature as FeatureType, User, Vote } from 'db';
import { FeatureForm } from 'app/pages';

const FeatureActions = ({
  id,
  refetch,
  feature,
}: {
  id: number;
  refetch: () => void;
  feature: FeatureType;
}) => {
  const [deleteFeatureMutation] = useMutation(deleteFeature);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <MenuContainer>
        <MenuButton
          p={1}
          pl="6px"
          ml="-1px"
          w="44px"
          variant="tertiary"
          _hover={{ backgroundColor: 'rgb(249, 250, 251)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none" />
            <circle
              cx="128.00098"
              cy="128.00049"
              r="56"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
            <path
              d="M216.001,120.001l10.30713-15.4603a8.18367,8.18367,0,0,0,1.07094-6.86806,103.18961,103.18961,0,0,0-7.652-18.50824,8.14437,8.14437,0,0,0-5.60531-4.08483l-18.23792-3.64791L184.57031,60.11816l-3.64788-18.23862a8.14452,8.14452,0,0,0-4.08517-5.60564,103.21306,103.21306,0,0,0-18.50891-7.65085,8.18366,8.18366,0,0,0-6.868,1.07071L136.001,40h-16L104.54162,29.69376a8.18369,8.18369,0,0,0-6.868-1.07071,103.21412,103.21412,0,0,0-18.50876,7.65077,8.1445,8.1445,0,0,0-4.08522,5.60591l-3.647,18.23746L60.11816,71.43164l-18.23762,3.647a8.14428,8.14428,0,0,0-5.60569,4.08493,103.19818,103.19818,0,0,0-7.652,18.50915,8.18354,8.18354,0,0,0,1.0709,6.86786L40,120v16L29.6937,151.45945a8.18369,8.18369,0,0,0-1.07072,6.86784,103.1749,103.1749,0,0,0,7.65075,18.50925,8.1448,8.1448,0,0,0,5.60561,4.08487l18.23882,3.64793,11.31348,11.31347,3.64709,18.2387a8.14473,8.14473,0,0,0,4.08479,5.60582A103.14826,103.14826,0,0,0,97.672,227.37827a8.18362,8.18362,0,0,0,6.86744-1.07079L120,216.001h16l15.46031,10.30714a8.18353,8.18353,0,0,0,6.868,1.07073,103.18533,103.18533,0,0,0,18.5082-7.65063,8.14479,8.14479,0,0,0,4.08487-5.6056l3.64793-18.23883,11.31347-11.31445,18.23862-3.64708a8.14431,8.14431,0,0,0,5.6057-4.08491,103.18916,103.18916,0,0,0,7.65192-18.508,8.18367,8.18367,0,0,0-1.07094-6.86806L216.001,136.001Z"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
          </svg>
        </MenuButton>
        <MenuList>
          <MenuItem onSelect={onOpen}>Edit</MenuItem>
          <MenuItem
            onSelect={async () => {
              await deleteFeatureMutation({ where: { id } });
              await refetch();
            }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </MenuContainer>
      <Modal isOpen={isOpen} onClose={onClose} overflow="hidden">
        <ModalHeader onClose={onClose}>Update Topic</ModalHeader>
        <FeatureForm initialValues={feature} onSuccess={onClose} />
      </Modal>
    </Box>
  );
};

export type FeatureWithAuthor = FeatureType & { author: User; votes: Vote[] };

export const Feature = ({
  feature,
  onVote,
  refetch,
}: {
  feature: FeatureWithAuthor;
  onVote: (id: number) => void;
  refetch: () => void;
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useCurrentUser();
  const userCreatedFeature = currentUser?.id === feature.author.id;

  const votedOnFeature = feature.votes.some(
    (vote) => vote.userId === currentUser?.id
  );

  return (
    <Box mt={3}>
      <Flex>
        <Flex alignItems="center" flexDirection="column" mr={2}>
          <Button
            border={0}
            p={2}
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await onVote(feature.id);
              setIsLoading(false);
            }}
          >
            <Box>
              <Box color={votedOnFeature ? 'purple.700' : 'inherit'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <rect width="256" height="256" fill="none" />
                  <path d="M213.65674,154.34326l-80-80a8,8,0,0,0-11.31348,0l-80,80A7.99981,7.99981,0,0,0,48,168H208a7.99981,7.99981,0,0,0,5.65674-13.65674Z" />
                </svg>
              </Box>
              {feature.votes.length}
            </Box>
          </Button>
          {userCreatedFeature && (
            <FeatureActions
              id={feature.id}
              feature={feature}
              refetch={refetch}
            />
          )}
        </Flex>
        <Flex flexDirection="column" mb={6} pt={2} flex={1}>
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
          {/* </Link> */}
          <Text
            fontWeight={400}
            color="gray.600"
            fontSize="base"
            lineHeight={1}
          >
            {feature.description}
          </Text>
          {/* <Flex mt={3} alignItems="center">
            <Image
              src={feature.author?.avatar ?? undefined}
              alt={feature.author?.name ?? undefined}
              width="30px"
              height="30px"
              borderRadius="full"
              mr={2}
            />

            <Text color="gray.400" fontSize="xs">
              {feature.author?.name}
            </Text>
          </Flex> */}
        </Flex>
      </Flex>
    </Box>
  );
};
