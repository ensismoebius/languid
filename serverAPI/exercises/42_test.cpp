#include <gtest/gtest.h>
#include "code.cpp"

TEST(ComecaComATest, Basico) {
    EXPECT_TRUE(comecaComA("abacate"));
    EXPECT_FALSE(comecaComA("melancia"));
    EXPECT_TRUE(comecaComA("Abacaxi"));
}
