#include <gtest/gtest.h>
#include "code.cpp"

TEST(CossenoTest, CasosBasicos) {
    EXPECT_NEAR(cosseno(0.0), 1.0, 1e-6);
    EXPECT_NEAR(cosseno(M_PI), -1.0, 1e-6);
}
