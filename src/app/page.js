import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "../components/SignInForm";

import { Box, Container, Typography, Paper, useTheme } from "@mui/material";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="grey.100"
      px={2}
    >
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ textAlign: "center", py: 6, px: 3 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Welcome to PlanPilot 🚀
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Your mission control for projects, kanban boards, and real-time
            collaboration.
          </Typography>

          <Box mt={4}>
            <SignInForm />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
