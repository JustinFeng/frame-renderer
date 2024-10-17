'use client';
import { useFarcasterIdentity } from '@frames.js/render/identity/farcaster';
import { useFrame } from '@frames.js/render/use-frame';
import { fallbackFrameContext } from '@frames.js/render';
import {
  FrameUI,
  type FrameUIComponents,
  type FrameUITheme,
} from '@frames.js/render/ui';
import { WebStorage } from '@frames.js/render/identity/storage';
import {useEffect} from 'react';

/**
 * StylingProps is a type that defines the props that can be passed to the components to style them.
 */
type StylingProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * You can override components to change their internal logic or structure if you want.
 * By default it is not necessary to do that since the default structure is already there
 * so you can just pass an empty object and use theme to style the components.
 *
 * You can also style components here and completely ignore theme if you wish.
 */
const components: FrameUIComponents<StylingProps> = {};

/**
 * By default there are no styles so it is up to you to style the components as you wish.
 */
const theme: FrameUITheme<StylingProps> = {
  Root: {
    className:
      'flex flex-col max-w-[600px] gap-2 border rounded-lg ovrflow-hidden bg-white relative',
  },
  LoadingScreen: {
    className: 'absolute top-0 left-0 right-0 bottom-0 bg-gray-300 z-10',
  },
  ImageContainer: {
    className: 'relative w-full border-b border-gray-300 overflow-hidden',
    style: {
      aspectRatio: 'var(--frame-image-aspect-ratio)', // helps to set the fixed loading skeleton size
    },
  },
  ButtonsContainer: {
    className: 'flex justify-evenly',
  },
  Button: {
    className: 'text-gray-900 grow border-r-2 last:border-r-0',
  },
};

export default function App() {
  const signerState = useFarcasterIdentity({
    onMissingIdentity: () => {
      // @todo implement a sign in dialog or anything you want that will then call signerState.createSigner()
      console.log('Create a signer');
      signerState.createSigner();
    },

    // WebStorage is default value for storage option. It uses local storage by default.
    // You can implement your own storage that implements the Storage interface from @frames.js/render/identity/types.
    storage: new WebStorage(),

    // visibilityChangeDetectionHook is used to detect whether the current UI is visible to the user. For example if the user changed to another tab.
    // It affects how polling for the identity is done. By default it uses the Page Visibility API.
    // The hook must satisfy VisibilityDetectionHook type from @frames.js/render/identity/types.
    // visibilityChangeDetectionHook: ...
  });

  const frameState = useFrame({
    // replace with frame URL
    homeframeUrl:
      'https://farcaster-tokenscript-frame.vercel.app/api/view/137/0xd5ca946ac1c1f24eb26dae9e1a53ba6a02bd97fe?tokenId=1997912245',
    // corresponds to the name of the route for POST and GET in step 2
    frameActionProxy: '/frames',
    frameGetProxy: '/frames',
    connectedAddress: undefined,
    frameContext: fallbackFrameContext,
    // map to your identity if you have one
    signerState,
  });

  useEffect(() => {
    signerState.createSigner();
  }, [])

  return (
    <FrameUI frameState={frameState} components={components} theme={theme} />
  );
}
