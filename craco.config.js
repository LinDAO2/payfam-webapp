const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@/assets": path.resolve(__dirname, "src/assets/"),
      "@/utils": path.resolve(__dirname, "src/utils/"),
      "@/events": path.resolve(__dirname, "src/events/"),
      "@/screens": path.resolve(__dirname, "src/screens/"),
      "@/routes": path.resolve(__dirname, "src/routes/"),
      "@/models": path.resolve(__dirname, "src/models/"),
      "@/repositories": path.resolve(__dirname, "src/repositories/"),
      "@/services": path.resolve(__dirname, "src/services/"),
      "@/components": path.resolve(__dirname, "src/components/"),
      "@/layouts": path.resolve(__dirname, "src/layouts/"),
      "@/configs": path.resolve(__dirname, "src/configs/"),
      "@/interfaces": path.resolve(__dirname, "src/typescript/interfaces/"),
      "@/constants": path.resolve(__dirname, "src/constants/"),
      "@/schemas": path.resolve(__dirname, "src/graphql/schemas/"),
      "@/resolvers": path.resolve(__dirname, "src/graphql/resolvers/"),
      "@/queries": path.resolve(__dirname, "src/graphql/queries/"),
      "@/mutations": path.resolve(__dirname, "src/graphql/mutations/"),
      "@/styles": path.resolve(__dirname, "src/styles/"),
      "@/hooks": path.resolve(__dirname, "src/hooks/"),
      "@/helpers": path.resolve(__dirname, "src/helpers/"),
      "@/validations": path.resolve(__dirname, "src/validations/"),
      "@/contexts": path.resolve(__dirname, "src/contexts/"),
      "@/db": path.resolve(__dirname, "src/db/"),
      "@/typescript": path.resolve(__dirname, "src/typescript/"),
      "@/types": path.resolve(__dirname, "src/types/"),
      "@/repository": path.resolve(__dirname, "src/repositories/"),
      "@/atoms": path.resolve(__dirname, "src/components/atoms/"),
      "@/molecules": path.resolve(__dirname, "src/components/molecules/"),
      "@/widgets": path.resolve(__dirname, "src/components/widgets/"),
      "@/mock": path.resolve(__dirname, "src/mock/"),
      "@/contracts": path.resolve(__dirname, "src/contracts/"),
    },
  },
};