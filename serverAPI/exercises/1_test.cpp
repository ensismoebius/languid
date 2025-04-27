#include <gtest/gtest.h>
#include <iostream>

// Definição da função soma
int soma(int a, int b);

TEST(SomaTest, Positivos)
{
    EXPECT_EQ(soma(1, 2), 3);
    EXPECT_EQ(soma(10, 20), 30);
}

TEST(SomaTest, Negativos)
{
    EXPECT_EQ(soma(-1, -2), -3);
    EXPECT_EQ(soma(-10, -20), -30);
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
