import Uppy from "@uppy/core";

import {
  Dropzone,
  UploadButton,
  FilesList,
  UppyContextProvider
} from '@uppy/react';
import React, { useState } from 'react';
import { Props } from './types/Uploader';
import CreateUppyInstance from './utils/createUppy';

import 'tailwindcss';
import '@uppy/react/css/style.css';


/**
 * Component description
 */
const DashUploaderUppy5 = (props: Props) => {
  const [uppy] = useState<Uppy>(() => CreateUppyInstance(props));

  return (
    <UppyContextProvider uppy={uppy}>
      <main className="p-5 max-w-xl mx-auto">
        <h1 className="text-4xl font-bold my-4">Welcome to Uppy5!</h1>

        <UploadButton />

        <article>
          <h2 className="text-2xl my-4">With list</h2>
          <Dropzone />
          <FilesList />
        </article>
      </main>
    </UppyContextProvider>
  );
}

export default DashUploaderUppy5;
