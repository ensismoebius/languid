#include <gtest/gtest.h>
#include "/tmp/code.cpp"

TEST(FuncaoSomaTest, SomaCorreta)
{
    extern int soma(int, int);
    EXPECT_EQ(soma(3, 4), 7);
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}