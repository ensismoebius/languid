#include <gtest/gtest.h>
#include "/tmp/code.cpp"

TEST(FuncaoMultTest, MultiCorreta)
{
    extern int mult(int, int);
    EXPECT_EQ(mult(3, 4), 12);
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}