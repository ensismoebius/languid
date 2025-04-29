#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(SomaMatrizTest, OutputTest)
{
    system("echo '1 2 3 4\n5 6 7 8' | /tmp/code_exec > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "6 8");
    std::getline(saida, linha);
    EXPECT_EQ(linha, "10 12");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
