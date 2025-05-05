#include <gtest/gtest.h>
#include "code.cpp"

TEST(SenoTest, CasosBasicos) {
    EXPECT_NEAR(seno(0.0), 0.0, 1e-6);
    EXPECT_NEAR(seno(M_PI / 2), 1.0, 1e-6);
}
