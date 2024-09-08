import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import "swagger-ui-react/swagger-ui.css";

import SwaggerUI from "swagger-ui-react";

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    apiFolder: "src/pages/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Ifarra-Ambisius API",
        version: "1.0",
        description:
          "This API provides endpoints for managing user data and other resources in the Ifarra-Ambisius application.",
        contact: {
          name: "Ifarra",
          url: "https://github.com/Ifarra",
          email: "ifarra1324@gmail.com",
        },
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
